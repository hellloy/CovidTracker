namespace CovidTrackerServer.Models
{
    public class TrackerItemModel
    {
        public string State { get; set; }
        public int OverallLevel { get; set; }
        public int CasesLevel { get; set; }
        public int TestPositivityLevel { get; set; }
        public int InfectionLevel { get; set; }
    }
}
