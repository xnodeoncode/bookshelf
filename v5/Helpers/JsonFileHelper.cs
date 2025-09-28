
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using bookshelf.Models;

namespace bookshelf.Helpers;

public static class JsonFileHelper
{
    public static async Task<List<Book>> ReadBooksFromJson(string filePath)
    {
        string json = string.Empty;
        string fullPath = Path.Combine("wwwroot", "data", filePath);
        if (!File.Exists(fullPath))
        {
            return new List<Book>();
        }
        using (StreamReader r = new StreamReader(fullPath))
        {
            json = await r.ReadToEndAsync();
        }
        return JsonSerializer.Deserialize<List<Book>>(json) ?? new List<Book>();
    }

    public static async Task<string> ReadJsonFile(string filePath)
    {
        string json = string.Empty;

        if (!File.Exists(filePath))
            return string.Empty;

        using (StreamReader r = new StreamReader(filePath))
        {
            json = await r.ReadToEndAsync();
        }
        
        return json;
    }
}