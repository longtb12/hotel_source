using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DataServices.Object.Model
{
    public class BaseModel
    {
        public int? ModifiedUserId { get; set; }

        public DateTime? ModifiedDate { get; set; }
        [Required]
        public int? CreatedUserId { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }

        public bool? Deleted { get; set; }
    }
}
