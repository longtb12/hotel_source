using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DataServices.Object.Model
{
    public class Department : BaseModel
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public int ParentId { get; set; }
        [Required]
        public bool IsUnit { get; set; }
        public string IdentityCode { get; set; }
        public string Acronym { get; set; }
        public string ShortName { get; set; }
        [Required]
        [MaxLength(255)]
        public string FullName { get; set; }
        [Required]
        public int Level { get; set; }
        [Required]
        public int SortOrder { get; set; }
        [Required]
        public int Status { get; set; }
        [Required]
        public bool IsRoot { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
    }
}
