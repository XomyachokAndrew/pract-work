using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pract.Context;
using Pract.DTOs;
using Pract.Models;

namespace Pract.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PostsController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/posts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
        {
            return await _context.Posts.ToListAsync();
        }

        [HttpGet("workers/{id}")]
        public async Task<ActionResult<IEnumerable<PostHistoryDto>>> GetHistoryPostForWorker(Guid id)
        {
            List<PostHistoryDto>? postHistories = [];

            var workerPost = await _context.WorkerPosts
                .Where(wp => wp.WorkerId == id)
                .OrderByDescending(wp => wp.CreatedAt)
                .ToListAsync();
            PostHistoryDto? postHistoryDto = null;

            if (workerPost != null)
            {
                foreach (var item in workerPost)
                {
                    var post = await _context.Posts.FindAsync(item.PostId);
                    postHistoryDto = new()
                    {
                        Id = item.Id,
                        Name = post.Name,
                        CreatedAt = item.CreatedAt,
                        UpdatedAt = item.UpdatedAt,
                    };

                    postHistories.Add(postHistoryDto);
                }
                return postHistories;
            }

            return NoContent();
        }

        // GET api/posts/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPost(Guid id)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                return NotFound();
            }

            return post;
        }

        // PUT api/posts/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPost(Guid id, PostDto postDto)
        {
            if (!PostExists(id))
            {
                return BadRequest();
            }

            var post = new Post
            {
                Name = postDto.Name
            };

            post.UpdatedAt = DateTime.Now;
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST api/posts/{id}
        [HttpPost]
        [Consumes("application/json")]
        public async Task<ActionResult<PostDto>> PostPost([FromBody] PostDto post)
        {
            var result = new Post
            {
                Name = post.Name,
            };

            _context.Posts.Add(result);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPost", new { id = result.Id }, result);
        }

        // DELETE api/posts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null || post.IsDeleted) // Проверяем, не удалена ли уже запись
            {
                return NotFound();
            }

            // Мягкое удаление
            post.IsDeleted = true;
            post.UpdatedAt = DateTime.Now; // Обновляем время изменения

            _context.Posts.Update(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE api/posts/workers/{id}
        [HttpDelete("workers/{id}")]
        public async Task<IActionResult> DeletePostWorker(Guid id)
        {
            var workerPost = await _context.WorkerPosts
                .Where(wp => wp.WorkerId == id && wp.UpdatedAt == null)
                .FirstOrDefaultAsync();

            if (workerPost == null || workerPost.IsDeleted)
            {
                return NotFound();
            }

            workerPost.UpdatedAt = DateTime.Now;

            _context.WorkerPosts.Update(workerPost);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PostExists(Guid id)
        {
            return _context.Posts.Any(e => e.Id == id);
        }
    }
}
