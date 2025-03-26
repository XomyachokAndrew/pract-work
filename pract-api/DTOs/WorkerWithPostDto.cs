namespace Pract.DTOs
{
    public class WorkerWithPostDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public PostDto? Post { get; set; } = null;
    }
}
