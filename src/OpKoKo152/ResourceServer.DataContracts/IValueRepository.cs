using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace ResourceServer.DataContracts
{
    public interface IValueRepository
    {
        ValueDataContract GetValue(int id);
        ValueDataContract AddOrUpdateValue(ValueDataContract value);
        void DeleteValue(int id);

        Task<ValueDataContract> GetValueAsync(int id);
        Task<ValueDataContract> AddOrUpdateValueAsync(ValueDataContract value);
        Task DeleteValueAsync(int id);
    }
}
