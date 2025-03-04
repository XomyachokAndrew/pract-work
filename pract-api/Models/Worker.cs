using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pract.Models
{
    public class Worker : BaseEntity
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("office_id")]
        public Guid OfficeId { get; set; }

        [Column("post_id")]
        public Guid PostId { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [ForeignKey("OfficeId")]
        public Post Post { get; set; } = new Post();

        [ForeignKey("PostId")]
        public Office Office { get; set; } = new Office();
    }
}
