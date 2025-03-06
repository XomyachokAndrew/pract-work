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

        // PUT api/offices/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOffice(Guid id, OfficeDto officeDto)
        {
            if (!OfficeExists(id))
            {
                return BadRequest();
            }

            var office = new Office
            {
                Name = officeDto.Name,
                Address = officeDto.Address,
            };

            office.UpdatedAt = DateTime.Now; // Обновляем время изменения
            _context.Offices.Update(office);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST api/offices/{id}
        [HttpPost]
        public async Task<ActionResult<OfficeDto>> PostOffice(OfficeDto office)
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

        private bool OfficeExists(Guid id)
        {
            return _context.Offices.Any(e => e.Id == id);
        }
    }
}
