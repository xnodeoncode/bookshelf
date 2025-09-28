using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace bookshelf.Models;

public class BaseModel
{
    [Key]
    [Required]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [JsonPropertyName("id")]
    [JsonInclude]
    [Range(0, int.MaxValue, ErrorMessage = "Id must be a non-negative integer.")]
    public int Id { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? DeletedAt { get; set; } = null;

    public bool IsDeleted => DeletedAt.HasValue;
}