using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using bookshelf.Helpers;
using bookshelf.Models;


namespace bookshelf.Controllers;

public class BookController : Controller
{
    private readonly ILogger<BookController> _logger;
    public List<Book> _books;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public BookController(ILogger<BookController> logger, IHttpContextAccessor httpContextAccessor)
    {
        _logger = logger;
        _httpContextAccessor = httpContextAccessor;

        var value = (_httpContextAccessor.HttpContext != null) ? _httpContextAccessor.HttpContext.Session.GetString("Books") : string.Empty;
        if (!string.IsNullOrEmpty(value))
        {
            _books = JsonSerializer.Deserialize<List<Book>>(value) ?? new List<Book>();
        }
        else
        {
            _books = ReadBooksFromJson();
            if (_httpContextAccessor.HttpContext?.Session != null)
            {
                _httpContextAccessor.HttpContext.Session.SetString("Books", JsonSerializer.Serialize(_books));
            }
        }

    }

    public IActionResult Index()
    {
        return View(_books);
    }

    [HttpGet]
    [Route("Book/Details/{id:int}")]
    public IActionResult Details(int id)
    {
        var book = _books.FirstOrDefault(b => b.Id == id);
        if (book == null)
        {
            return NotFound();
        }

        return View(book);
    }

    [HttpGet]
    [Route("Book/Edit/{id:int}")]
    public IActionResult Edit(int id)
    {
        var book = _books.FirstOrDefault(b => b.Id == id);
        if (book == null)
        {
            return NotFound();
        }
        // var title = "Bookshelf v5 | Edit " + book.Title;
        // ViewData["Title"] = title;

        return View(book);
    }

    [HttpPost]
    public IActionResult Edit(Book book)
    {
        if (ModelState.IsValid)
        {
            // Update the book in the database or perform other actions
            var existingBookIndex = _books.FindIndex(b => b.Id == book.Id);
            if (existingBookIndex != -1)
            {
                _books[existingBookIndex].UpdatedAt = DateTime.UtcNow;
                _books[existingBookIndex].DeletedAt = book.DeletedAt;
                _books[existingBookIndex].Title = book.Title;
                _books[existingBookIndex].Author = book.Author;
                _books[existingBookIndex].Description = book.Description;
                _books[existingBookIndex].ISBN = book.ISBN;
                _books[existingBookIndex].PublishedDate = book.PublishedDate;
                _books[existingBookIndex].Publisher = book.Publisher;
                _books[existingBookIndex].CoverImageUrl = book.CoverImageUrl;
                _books[existingBookIndex].PurchaseLink = book.PurchaseLink;
                _books[existingBookIndex].PageCount = book.PageCount;
            }
            UpdateBook(book);
            return RedirectToAction("Index");
        }
        return View(book);
    }

    public IActionResult Create()
    {
        return View();
    }

    [HttpPost]
    public IActionResult Create(Book book)
    {
        book.Id = _books.Count > 0 ? _books.Max(b => b.Id) + 1 : 1;
        book.CreatedAt = DateTime.UtcNow;
        book.UpdatedAt = DateTime.UtcNow;
        book.PublishedDate = book.PublishedDate;
        book.CoverImageUrl = string.IsNullOrEmpty(book.CoverImageUrl) ? "https://via.placeholder.com/150x200.png?text=No+Cover" : book.CoverImageUrl;
        book.PurchaseLink = string.IsNullOrEmpty(book.PurchaseLink) ? "https://example.com" : book.PurchaseLink;
        book.Description = string.IsNullOrEmpty(book.Description) ? "No description available." : HtmlEncoder.Default.Encode(book.Description);
        book.Title = HtmlEncoder.Default.Encode(book.Title);
        book.Author = HtmlEncoder.Default.Encode(book.Author);
        book.ISBN = HtmlEncoder.Default.Encode(book.ISBN);
        book.Publisher = HtmlEncoder.Default.Encode(book.Publisher);
        book.PageCount = book.PageCount >= 0 ? book.PageCount : 0;
        if (ModelState.IsValid)
        {
            // Save the book to the database or perform other actions
            AddBook(book);
            return RedirectToAction("Index");
        }
        return View(book);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }

    private void AddBook(Book book)
    {
        _books.Add(book);
        // Optionally, save the updated list to a persistent storage
        if (_httpContextAccessor.HttpContext?.Session != null)
        {
            _httpContextAccessor.HttpContext.Session.SetString("Books", JsonSerializer.Serialize(_books));
        }
        SaveBooksToJson();
    }

    private void UpdateBook(Book book)
    {
        var existingBookIndex = _books.FindIndex(b => b.Id == book.Id);
        if (existingBookIndex != -1 && _httpContextAccessor.HttpContext?.Session != null)
        {
            _books[existingBookIndex] = book;
            _httpContextAccessor.HttpContext.Session.SetString("Books", JsonSerializer.Serialize(_books));
        }
        SaveBooksToJson();
    }

    private void SoftDeleteBook(int id)
    {
        var book = _books.FirstOrDefault(b => b.Id == id);
        if (book != null)
        {
            book.DeletedAt = DateTime.UtcNow;
            UpdateBook(book);
        }
    }

    private void SaveBooksToJson()
    {
        string fileName = "books.json";
        string json = JsonSerializer.Serialize(_books, new JsonSerializerOptions
        {
            WriteIndented = true,
            Encoder = JavaScriptEncoder.Create(UnicodeRanges.All)
        });
        string fullPath = Path.Combine("wwwroot", "data", fileName);
        System.IO.File.WriteAllText(fullPath, json);
    }   

    private List<Book> ReadBooksFromJson()
    {
        string json = string.Empty;
        string fileName = "books.json";
        string fullPath = Path.Combine("wwwroot", "data", fileName);
        var books = new List<Book>();

        if (!System.IO.File.Exists(fullPath))
            return books;

        var data = Task.Run(() => JsonFileHelper.ReadJsonFile(fullPath)).Result;

        return JsonSerializer.Deserialize<List<Book>>(data) ?? new List<Book>();
    }
}