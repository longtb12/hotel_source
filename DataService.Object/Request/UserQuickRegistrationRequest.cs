using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DataServices.Object.Request
{
    public class UserQuickRegistrationRequest
    {
        [Required]
        [MaxLength(50)]
        public string UserName { get; set; }
        [Required]
        [MaxLength(255)]
        public string Password { get; set; }
        [Required]
        public bool PasswordChanged { get; set; }
        [Required]
        public bool IsRoot { get; set; }
        public int? UserId { get; set; }
    }
}
