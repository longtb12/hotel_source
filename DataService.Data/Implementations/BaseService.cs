using System;
using System.Collections.Generic;
using System.Text;
using DataAccess.Repositories.Interfaces;
namespace DataServices.Implementations
{
    public class BaseService
    {
        protected readonly IRepository _repository;
        public BaseService(IRepository repository)
        {
            _repository = repository;
        }
    }
}
