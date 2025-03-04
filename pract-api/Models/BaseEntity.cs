using System.ComponentModel.DataAnnotations.Schema;

namespace Pract.Models
{
    public abstract class BaseEntity
    {
        [Column("crated_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("is_deleted")]
        public bool IsDeleted { get; set; }
    }
}
