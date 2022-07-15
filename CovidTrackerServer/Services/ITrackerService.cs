using CovidTrackerServer.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CovidTrackerServer.Services
{
    public interface ITrackerService
    {
        public Task<List<TrackerItemModel>> GetData();
    }
}
