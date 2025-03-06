using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pract.Models
{
    [Table("worker_posts")]
    public class WorkerPosts : BaseEntity
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("worker_id")]
        public Guid WorkerId { get; set; }

        [Column("post_id")]
        public Guid PostId { get; set; }

        [ForeignKey("PostId")]
        public Post Post { get; set; }

        [ForeignKey("WorkerId")]
        public Worker Worker { get; set; }
    }
}
