using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResourceServer.DataContracts;
using ResourceServer.DAL.Extensions;
using ResourceServer.DAL.Models;

namespace ResourceServer.DAL
{
    public class ValueRepository : IValueRepository
    {
        private readonly Context _context;

        public ValueRepository(Context context)
        {
            _context = context;
        }

        public ValueDataContract GetValue(int id)
        {
            var result = new ValueDataContract {Id = -1};

            var valueModel = _context.Values.SingleOrDefault(item => item.Id == id);

            if (valueModel != null)
            {
                result = valueModel.Convert();
            }

            return result;
        }

        public ValueDataContract AddOrUpdateValue(ValueDataContract value)
        {
            ValueDataContract result;

            if (value.Id < 1)
            {
                var valueModel = new Value();
                valueModel.Populate(value);
                valueModel = _context.Values.Add(valueModel);
                _context.SaveChanges();

                result = valueModel.Convert();
            }
            else
            {
                var valueModel = _context.Values.Single(item => item.Id == value.Id);
                valueModel.Populate(value);
                _context.SaveChanges();

                result = valueModel.Convert();
            }
            
            return result;
        }

        public void DeleteValue(int id)
        {
            var valueModel = _context.Values.Single(item => item.Id == id);
            _context.Values.Remove(valueModel);

            _context.SaveChanges();
        }

        public async Task<ValueDataContract> GetValueAsync(int id)
        {
            var result = new ValueDataContract { Id = -1 };

            var valueModel = await _context.Values.SingleOrDefaultAsync(item => item.Id == id);

            if (valueModel != null)
            {
                result.Name = valueModel.Name;
            }

            return result;
        }

        public async Task<ValueDataContract> AddOrUpdateValueAsync(ValueDataContract value)
        {
            ValueDataContract result;

            if (value.Id < 1)
            {
                var valueModel = new Value();
                valueModel.Populate(value);
                valueModel = _context.Values.Add(valueModel);
                await _context.SaveChangesAsync();

                result = valueModel.Convert();
            }
            else
            {
                var valueModel = await _context.Values.SingleAsync(item => item.Id == value.Id);
                valueModel.Populate(value);
                await _context.SaveChangesAsync();

                result = valueModel.Convert();
            }

            return result;
        }

        public async Task DeleteValueAsync(int id)
        {
            var valueModel = _context.Values.Single(item => item.Id == id);
            _context.Values.Remove(valueModel);

            await _context.SaveChangesAsync();
        }
    }
}
