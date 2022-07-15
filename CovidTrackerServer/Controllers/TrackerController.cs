using CovidTrackerServer.Models;
using CovidTrackerServer.Services;
using CovidTrackerServer.Wrapper;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CovidTrackerServer.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TrackerController : ControllerBase
    {
        private readonly ITrackerService _trackerService;
        public TrackerController(ITrackerService trackerService) => _trackerService = trackerService;

        [HttpGet]
        public async Task<Result<List<TrackerItemModel>>> Get()
        {
            try
            {
                List<TrackerItemModel> items = await _trackerService.GetData();
                return await Result<List<TrackerItemModel>>.SuccessAsync(items);
            }
            catch (System.Exception e)
            {

                return await  Result<List<TrackerItemModel>>.FailAsync(e.Message);
            }
            
        }
    }
}
