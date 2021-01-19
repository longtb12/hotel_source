using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DataServices.Object.Model
{
    public class Function : BaseModel
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public int ParentId { get; set; }
        [Required]
        public string IdentityCode { get; set; }
        [Required]
        [MaxLength(255)]
        public string Name { get; set; }
        public string Icon { get; set; }
        public string ActionLink { get; set; }
        [Required]
        public int SortOrder { get; set; }
        [Required]
        public int Status { get; set; }
        [Required]
        public bool ShowInMenu { get; set; }
        public string Description { get; set; }
        public int Level { get; set; }
    }
}
