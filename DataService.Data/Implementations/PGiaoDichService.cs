using DataAccess.Repositories.Interfaces;
using DataService.Data.Interfaces;
using DataService.Object.Model;
using DataService.Object.Request;
using DataService.Object.Response;
using DataServices.Implementations;
using DataServices.Object.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataService.Data.Implementations
{
    public class PGiaoDichService : BaseService, IPGiaoDichService
    {
        public PGiaoDichService(IRepository repository) : base(repository)
        {

        }
        public async Task<List<PGiaoDichReponse>> listUsedGD(int pageIndex, int pageSize)
        {
            return await _repository.ExecuteReader<PGiaoDichReponse>("ListUsedPGD", new
            {
                pageIndex = pageIndex,
                pageSize = pageSize
            });
        }
        public async Task<List<PGiaoDichReponse>> listSuccessGD(int pageIndex, int pageSize)
        {
            return await _repository.ExecuteReader<PGiaoDichReponse>("GetSuccess", new
            {
                pageIndex = pageIndex,
                pageSize = pageSize
            });
        }
        public async Task<int> Paid(int Id)
        {
            return await _repository.ExecuteNonQuery("PaidRoom", new { Id = Id });
        }

        public async Task<PGiaoDichReponse> GetById(int Id)
        {
            var a = await _repository.ExecuteReader<PGiaoDichReponse>("PGiaoDichGetById", new { Id = Id });
            return a.FirstOrDefault();
        }
        public async Task<List<GiaoDich>> GetByPGDID(int Id)
        {
            return await _repository.ExecuteReader<GiaoDich>("GiaoDichGetByPGDId", new { Id = Id });
        }
    }
}
