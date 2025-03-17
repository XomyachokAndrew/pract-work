using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pract.Context;
using Pract.DTOs;
using Pract.Models;

namespace Pract.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OfficesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OfficesController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/offices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Office>>> GetOffices()
        {
            return await _context.Offices.ToListAsync();
        }

        // GET api/offices/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Office>> GetOffice(Guid id)
        {
            var office = await _context.Offices.FindAsync(id);

            if (office == null)
            {
                return NotFound();
            }

            return office;
        }

        // GET api/offices/{id}
        [HttpGet("workers/{id}")]
        public async Task<ActionResult<IEnumerable<OfficeHistoryDto>>> GetHistoryOfficeForWorker(Guid id)
        {
            List<OfficeHistoryDto>? officeHistories = [];

            var workerOffice = await _context.WorkerOffices
                .Where(wo => wo.WorkerId == id)
                .OrderByDescending(wo => wo.CreatedAt)
                .ToListAsync();
            OfficeHistoryDto? officeHistory = null;

            if (workerOffice != null)
            {
                foreach (var item in workerOffice)
                {
                    var office = await _context.Offices.FindAsync(item.OfficeId);
                    officeHistory = new()
                    {
                        Id = item.Id,
                        Name = office.Name,
                        CreatedAt = item.CreatedAt,
                        UpdatedAt = item.UpdatedAt ?? null,
                    };

                    officeHistories.Add(officeHistory);
                }
                return officeHistories;
            }

            return NoContent();
        }

        // PUT api/offices/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOffice(Guid id, [FromBody] OfficeDto officeDto)
        {
            if (!OfficeExists(id))
            {
                return BadRequest();
            }

            var office = await _context.Offices.FindAsync(id);
            office.Name = officeDto.Name;
            office.Address =  officeDto.Address;
            office.UpdatedAt = DateTime.Now; // Обновляем время изменения
            
            _context.Offices.Update(office);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST api/offices/{id}
        [HttpPost]
        [Consumes("application/json")]
        public async Task<ActionResult<OfficeDto>> PostOffice([FromBody] OfficeDto office)
        {
            var result = new Office
            {
                Name = office.Name,
                Address = office.Address
            };

            _context.Offices.Add(result);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOffice", new { id = result.Id }, result);
        }

        // DELETE api/offices/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOffice(Guid id)
        {
            var office = await _context.Offices.FindAsync(id);
            if (office == null || office.IsDeleted) // Проверяем, не удалена ли уже запись
            {
                return NotFound();
            }

            // Мягкое удаление
            office.IsDeleted = true;
            office.UpdatedAt = DateTime.Now; // Обновляем время изменения

            _context.Offices.Update(office);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE api/offices/workers/{id}
        [HttpDelete("workers/{id}")]
        public async Task<IActionResult> DeleteOfficeWorker(Guid id)
        {
            var workerOffice = await _context.WorkerOffices
                .Where(wp => wp.WorkerId == id && wp.UpdatedAt == null)
                .FirstOrDefaultAsync();

            if (workerOffice == null || workerOffice.IsDeleted)
            {
                return NotFound();
            }

            workerOffice.UpdatedAt = DateTime.Now;

            _context.WorkerOffices.Update(workerOffice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OfficeExists(Guid id)
        {
            return _context.Offices.Any(e => e.Id == id);
        }
    }
}
