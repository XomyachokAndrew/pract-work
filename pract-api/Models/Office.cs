using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pract.Models
{
    public class Office : BaseEntity
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        public List<Worker> Workers { get; set; } = new List<Worker>();
    }
}
