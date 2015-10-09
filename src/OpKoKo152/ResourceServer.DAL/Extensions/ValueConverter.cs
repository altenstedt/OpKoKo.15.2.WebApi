using ResourceServer.DataContracts;
using ResourceServer.DAL.Models;

namespace ResourceServer.DAL.Extensions
{
    public static class ValueConverter
    {
        public static ValueDataContract Convert(this Value value)
        {
            var result = new ValueDataContract
            {
                Id = value.Id,
                Name = value.Name
            };

            return result;
        }

        public static void  Populate(this Value valueModel, ValueDataContract valueDataContract)
        {
            valueModel.Name = valueDataContract.Name;
            valueModel.Id = valueDataContract.Id;
        }
    }
}
