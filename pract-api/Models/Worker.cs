using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pract.Models
{
    [Table("workers")]
    public class Worker : BaseEntity
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("surname")]
        public string Surname { get; set; }
        
        [Column("first_name")]
        public string FirstName { get; set; }
        
        [Column("patronymic")]
        public string Patronymic { get; set; }

        public List<WorkerPosts> WorkerPosts { get; set; }

        public List<WorkerOffices> WorkerOffices { get; set; }
    }
}
