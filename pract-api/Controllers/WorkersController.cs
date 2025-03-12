using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pract.Context;
using Pract.DTOs;
using Pract.Models;

namespace Pract.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WorkersController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/workers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkerWithDetailsDto>>> GetWorkers()
        {
            var workersWithDetails = new List<WorkerWithDetailsDto>();
            var workers = _context.Workers.ToList();


            foreach (var item in workers)
            {
                PostDto? postDto = new();
                OfficeDto? officeDto = new();

                var workerPost = await _context.WorkerPosts.Where(wp => wp.WorkerId == item.Id && wp.UpdatedAt == null).FirstOrDefaultAsync() ?? null;
                if (workerPost != null)
                {
                    var post = await _context.Posts.FindAsync(workerPost?.PostId) ?? null;
                    postDto.Id = post.Id;
                    postDto.Name = post.Name;
                }

                var workerOffice = await _context.WorkerOffices.Where(wo => wo.WorkerId == item.Id && wo.UpdatedAt == null).FirstOrDefaultAsync() ?? null;
                if (workerOffice != null)
                {
                    var office = await _context.Offices.FindAsync(workerOffice?.OfficeId) ?? null;
                    officeDto.Id = office.Id;
                    officeDto.Name = office.Name;
                    officeDto.Address = office.Address;
                }

                var newWorker = new WorkerWithDetailsDto
                {
                    Id = item.Id,
                    Name = new WorkerDto
                    {
                        Surname = item.Surname,
                        FirstName = item.FirstName,
                        Patronymic = item.Patronymic,
                    },
                    Post = postDto ?? null,
                    Office = officeDto ?? null,
                };

                workersWithDetails.Add(newWorker);
            }

            return workersWithDetails;
        }

        // GET api/workers/offices/{id}
        [HttpGet("offices/{id}")]
        public async Task<ActionResult<IEnumerable<WorkerWithPostDto>>> GetWorkersInOffice(Guid id)
        {
            var workersOffice = await _context.WorkerOffices
                .Where(wo => wo.OfficeId == id && wo.UpdatedAt == null)
                .OrderByDescending(wo => wo.CreatedAt)
                .ToListAsync() ?? null;

            Worker? worker = new();


            var workers = new List<WorkerWithPostDto>();

            foreach (var item in workersOffice)
            {
                PostDto? postDto = new();
                WorkerPosts? workerPost = new();

                worker = await _context.Workers.FindAsync(item.WorkerId);

                if (worker == null) continue;

                workerPost = await _context.WorkerPosts.Where(wp => wp.WorkerId == worker.Id && wp.UpdatedAt == null).FirstOrDefaultAsync() ?? null;
                if (workerPost != null)
                {
                    var post = await _context.Posts.FindAsync(workerPost?.PostId) ?? null;
                    postDto.Id = post.Id;
                    postDto.Name = post.Name;
                }

                var newWorker = new WorkerWithPostDto
                {
                    Id = worker.Id,
                    Name = $"{worker.Surname} {worker.FirstName} {worker.Patronymic}",
                    Post = postDto ?? null,
                };

                workers.Add(newWorker);
            }

            return workers;
        }

        // GET api/workers/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<WorkerWithDetailsDto>> GetWorker(Guid id)
        {
            var worker = await _context.Workers.FindAsync(id);

            PostDto? postDto = new();
            OfficeDto? officeDto = new();

            var workerPost = _context.WorkerPosts.Where(wp => wp.WorkerId == worker.Id && wp.UpdatedAt == null).FirstOrDefault() ?? null;
            if (workerPost != null)
            {
                var post = await _context.Posts.FindAsync(workerPost?.PostId) ?? null;
                postDto.Id = post.Id;
                postDto.Name = post.Name;
            }

            var workerOffice = _context.WorkerOffices.Where(wo => wo.WorkerId == worker.Id && wo.UpdatedAt == null).FirstOrDefault() ?? null;
            if (workerOffice != null)
            {
                var office = await _context.Offices.FindAsync(workerOffice?.OfficeId) ?? null;
                officeDto.Id = office.Id;
                officeDto.Name = office.Name;
                officeDto.Address = office.Address;
            }

            var workersWithDetail = new WorkerWithDetailsDto
            {
                Id = worker.Id,
                Name = new WorkerDto
                {
                    Surname = worker.Surname,
                    FirstName = worker.FirstName,
                    Patronymic = worker.Patronymic,
                },
                Post = postDto ?? null,
                Office = officeDto ?? null,
            };

            return workersWithDetail;
        }

        // PUT api/workers/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorker(Guid id, [FromBody] WorkerDto workerDto)
        {
            if (!WorkerExists(id))
            {
                return BadRequest();
            }

            var worker = await _context.Workers.FindAsync(id);
            worker.Surname = workerDto.Surname;
            worker.FirstName = workerDto.FirstName;
            worker.Patronymic = workerDto.Patronymic;
            worker.UpdatedAt = DateTime.Now;

            _context.Workers.Update(worker);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST api/workers
        [HttpPost]
        [Consumes("application/json")]
        public async Task<ActionResult<WorkerDto>> PostWorker([FromBody] WorkerDto worker)
        {
            var result = new Worker
            {
                Surname = worker.Surname,
                FirstName = worker.FirstName,
                Patronymic = worker.Patronymic
            };

            _context.Workers.Add(result);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWorker", new { id = result.Id }, result);
        }

        // POST api/workers/offices
        [HttpPost("offices")]
        [Consumes("application/json")]
        public async Task<ActionResult<WorkerOffices>> PostWorkerOffice([FromBody] WorkerOfficeDto workerOfficesDto)
        {
            // Находим предыдущую запись для этого работника
            var previousRecord = await _context.WorkerOffices
                .Where(wo => wo.WorkerId == workerOfficesDto.WorkerId)
                .OrderByDescending(wo => wo.CreatedAt)
                .FirstOrDefaultAsync();

            if (previousRecord != null)
            {
                // Обновляем updated_at предыдущей записи
                previousRecord.UpdatedAt = DateTime.Now;
                _context.WorkerOffices.Update(previousRecord);
            }

            // Создаем новую запись
            var newRecord = new WorkerOffices
            {
                WorkerId = workerOfficesDto.WorkerId,
                OfficeId = workerOfficesDto.OfficeId,
            };

            _context.WorkerOffices.Add(newRecord);
            await _context.SaveChangesAsync();

            return newRecord;
        }

        // POST api/workers/posts
        [HttpPost("posts")]
        [Consumes("application/json")]
        public async Task<ActionResult<WorkerPosts>> PostWorkerPost([FromBody] WorkerPostDto workerPostDto)
        {
            // Находим предыдущую запись для этого работника
            var previousRecord = await _context.WorkerPosts
                .Where(wo => wo.WorkerId == workerPostDto.WorkerId)
                .OrderByDescending(wo => wo.CreatedAt)
                .FirstOrDefaultAsync();

            if (previousRecord != null)
            {
                // Обновляем updated_at предыдущей записи
                previousRecord.UpdatedAt = DateTime.Now;
                _context.WorkerPosts.Update(previousRecord);
            }

            var result = new WorkerPosts
            {
                WorkerId = workerPostDto.WorkerId,
                PostId = workerPostDto.PostId,
            };

            _context.WorkerPosts.Add(result);
            await _context.SaveChangesAsync();

            return result;
        }

        // DELETE api/workers/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorker(Guid id)
        {
            var worker = await _context.Workers.FindAsync(id);
            if (worker == null || worker.IsDeleted) // Проверяем, не удалена ли уже запись
            {
                return NotFound();
            }

            // Мягкое удаление
            worker.IsDeleted = true;
            worker.UpdatedAt = DateTime.Now;

            _context.Workers.Update(worker);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WorkerExists(Guid id)
        {
            return _context.Workers.Any(e => e.Id == id);
        }
    }
}
