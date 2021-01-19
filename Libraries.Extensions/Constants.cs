using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Libraries.Extensions
{
    public class Constants
    {
        public class ConfigurationCode
        {
            public static string Category = "CATEGORY";
            public static string PageSize = "PAGESIZE";
        }
        public enum GlobalStatus
        {
            Actived = 1,
            NotActivated = 2
        }
        public enum Gender
        {
            Male,
            Female,
            Other
        }
        
    }
}
