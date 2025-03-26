using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pract.Models
{
    [Table("worker_offices")]
    public class WorkerOffices : BaseEntity
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("worker_id")]
        public Guid WorkerId { get; set; }

        [Column("office_id")]
        public Guid OfficeId { get; set; }

        [ForeignKey(nameof(WorkerId))]
        public Worker Worker { get; set; }

        [ForeignKey(nameof(OfficeId))]
        public Office Office { get; set; }
    }
}
