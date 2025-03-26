namespace Pract.DTOs
{
    public class WorkerWithOfficeDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public OfficeDto? Office { get; set; } = null;
    }
}
