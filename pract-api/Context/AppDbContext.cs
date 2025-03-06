using Microsoft.EntityFrameworkCore;
using Pract.Models;

namespace Pract.Context
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Worker> Workers { get; set; }
        public DbSet<Office> Offices { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<WorkerOffices> WorkerOffices { get; set; }
        public DbSet<WorkerPosts> WorkerPosts { get; set; }

        public override int SaveChanges()
        {
            var addedOrModifiedEntries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseEntity && (
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified));

            foreach (var entry in addedOrModifiedEntries)
            {
                var entity = (BaseEntity)entry.Entity;
                entity.UpdatedAt = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedAt = DateTime.UtcNow;
                }
            }

            var deletedEntries = ChangeTracker
                .Entries()
                .Where(e => e.State == EntityState.Deleted && e.Entity is BaseEntity);

            foreach (var entry in deletedEntries)
            {
                entry.State = EntityState.Modified;

                var entity = (BaseEntity)entry.Entity;
                entity.IsDeleted = true;
                entity.UpdatedAt = DateTime.UtcNow;
            }

            return base.SaveChanges();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Глобальный фильтр для исключения удалённых записей
            modelBuilder.Entity<Worker>().HasQueryFilter(c => !c.IsDeleted).Property(e => e.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
            modelBuilder.Entity<Office>().HasQueryFilter(o => !o.IsDeleted).Property(e => e.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
            modelBuilder.Entity<Post>().HasQueryFilter(o => !o.IsDeleted).Property(e => e.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
            modelBuilder.Entity<WorkerOffices>().HasQueryFilter(o => !o.IsDeleted).Property(e => e.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
            modelBuilder.Entity<WorkerPosts>().HasQueryFilter(o => !o.IsDeleted).Property(e => e.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }
        }
    }
}
