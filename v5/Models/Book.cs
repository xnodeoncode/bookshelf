using System;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace bookshelf.Models;

public class Book : BaseModel
{
    [Required]
    [JsonPropertyName("title")]
    [JsonInclude]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("subtitle")]
    [JsonInclude]
    public string Subtitle { get; set; } = string.Empty;

    [Required]
    [JsonPropertyName("author")]
    [JsonInclude]
    public string Author { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    [JsonInclude]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("isbn")]
    [JsonInclude]
    public string ISBN { get; set; } = string.Empty;

    [Range(0, int.MaxValue, ErrorMessage = "Page count must be a non-negative integer.")]
    [JsonPropertyName("pageCount")]
    [JsonInclude]
    public int PageCount { get; set; }
    
    [JsonPropertyName("publishedDate")]
    [JsonInclude]
    public DateTime? PublishedDate { get; set; }

    [JsonPropertyName("publisher")]
    [JsonInclude]
    public string Publisher { get; set; } = string.Empty;

    [JsonPropertyName("coverImageUrl")]
    [JsonInclude]
    public string CoverImageUrl { get; set; } = string.Empty;

    [JsonPropertyName("purchaseLink")]
    [JsonInclude]
    public string PurchaseLink { get; set; } = string.Empty;

}