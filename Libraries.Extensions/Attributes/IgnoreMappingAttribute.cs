using System;
using System.Collections.Generic;
using System.Text;

namespace Libraries.Extensions
{
    [AttributeUsage(AttributeTargets.Field | AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
    public class AdministrationIgnoreMappingAttribute : Attribute
    {
    }
}
