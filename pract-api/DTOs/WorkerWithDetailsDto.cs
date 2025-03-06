namespace Pract.DTOs
{
    public class WorkerWithDetailsDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public PostDto? Post { get; set; } = null;
        public OfficeDto? Office { get; set; } = null;
    }
}
