using DataService.Object.Model;
using DataService.Object.Response;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DataService.Data.Interfaces
{
    public interface IPGiaoDichService
    {
        Task<List<PGiaoDichReponse>> listUsedGD(int pageIndex,int pageSize);
        Task<List<PGiaoDichReponse>> listSuccessGD(int pageIndex, int pageSize);
        Task<int> Paid(int Id);
        Task<PGiaoDichReponse> GetById(int Id);
        Task<List<GiaoDich>> GetByPGDID(int Id);
    }
}
