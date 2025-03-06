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
        public async Task<ActionResult<PostDto>> PostPost(PostDto post)
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

        private bool PostExists(Guid id)
        {
            return _context.Posts.Any(e => e.Id == id);
        }
    }
}
