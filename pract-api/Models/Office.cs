using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pract.Models
{
    [Table("offices")]
    public class Office : BaseEntity
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("address")]
        public string Address { get; set; }

        public List<WorkerOffices> WorkerOffices { get; set; }
    }
}
