using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using CovidTrackerServer.Models;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
namespace CovidTrackerServer.Services
{
    public class TrackerService : ITrackerService
    {
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _configuration;

        public TrackerService(IMemoryCache cache, IConfiguration configuration)
        {
            _cache = cache;
            _configuration = configuration;
        }

        public async Task<List<TrackerItemModel>> GetData()
        {
            if (!_cache.TryGetValue($"data", out List<TrackerItemModel> data))
            {
                var key = _configuration.GetSection("AppConfiguration").GetValue<string>("Secret");
                var url = _configuration.GetSection("AppConfiguration").GetValue<string>("APIKey");
                
                var webClient = new WebClient();
                var json = await webClient.DownloadStringTaskAsync(new Uri($"{url}?apiKey={key}"));
                dynamic stuff = JsonConvert.DeserializeObject(json);

                data = ((IEnumerable)stuff ?? throw new InvalidOperationException()).Cast<dynamic>()
                    .Select(x => new TrackerItemModel
                    {
                        State = x.state,
                        OverallLevel = x.riskLevels?.overall == null ? 0 : x.riskLevels.overall,
                        CasesLevel = x.riskLevels?.caseDensity == null ? 0 : x.riskLevels.caseDensity,
                        InfectionLevel = x.riskLevels?.infectionRate == null ? 0 : x.riskLevels.infectionRate,
                        TestPositivityLevel = x.riskLevels?.testPositivityRatio == null ? 0 : x.riskLevels.testPositivityRatio,
                    }).ToList();

                _cache.Set($"data", data, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                });
            }

            return data;
        }
    }
}
