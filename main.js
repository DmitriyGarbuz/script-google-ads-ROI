function main() {
    var campaignStart = 'CampaignName = "Name"'; // <-- СЮДА НАЗВАНИЕ РК
  //Создание Ярлыка
    function applyLabel() {
      Logger.log ('Сзодание Ярлыка - началось!');
    var groupI = AdsApp.adGroups()
    .withCondition(campaignStart)
        .get();
    while (groupI.hasNext()) {
      var campaign = groupI.next();
      campaign.applyLabel('Test');
    }
      Logger.log ('Создание Ярлыка - закончилось!');
   }
applyLabel();

    function filterReportByLabelIds() {
      Logger.log ('Изминение ставки - началось!');
        var label = AdsApp.labels().withCondition(
             "Name = 'Test'").get().next();
        var query = 'SELECT CampaignName, CampaignId, AdGroupName, AdGroupId, AdGroupStatus, Clicks, Conversions, AverageCpc, CostPerAllConversion, SearchExactMatchImpressionShare, AllConversionValue, ConversionValue, Cost, AveragePosition ' +
            'FROM ADGROUP_PERFORMANCE_REPORT where Labels CONTAINS_ANY ' +
            '[' + label.getId('Test') + '] during LAST_14_DAYS';
             
           //  var spreadsheet = SpreadsheetApp.create("Dmitriy Test Nadavi"); Таблица по группам обявлений
             var report = AdsApp.report(query);
             var rows = report.rows();
             while (rows.hasNext()) {
             var row = rows.next();
             var groupName = row['AdGroupName'];
             var groupIds = row['AdGroupId'];
             var conversionValue = row['ConversionValue'];
             var cost = row['Cost'];
             var roi = conversionValue/cost;
             var clicks = row['Clicks'];
             var averageCpc = row['AverageCpc'];
             var averagePosition = row['AveragePosition'];
             var searchImpressionShare = row['SearchExactMatchImpressionShare'];
               if (roi > 2 && clicks > 10) {
             Logger.log(groupName + '|id: ' + groupIds + '| цен.конв.: ' + conversionValue + '| стоимость: ' + cost + '|ROI: ' + roi + '|клики: ' + clicks + '|cpc :' + averageCpc + '|сред.поз.: ' + averagePosition + '|%показ.: ' + searchImpressionShare );
                 var goodGroup = row['AdGroupId'];
                 Logger.log (goodGroup);
                 //бидер для групп
                 function setAdGroupDefaultCpcBid() {
                 var adGroup = AdsApp.adGroups()
                     .withCondition(campaignStart)
                     .withIds([goodGroup])
                     .get()
                     .next();
            var bid = adGroup.bidding().getCpa();
                   Logger.log (bid);
                   var bidnew = bid*1.05; // Повышение ставки
                   Logger.log (bidnew);
               
                adGroup.bidding().setCpa(bidnew)
               }
               setAdGroupDefaultCpcBid();
               }
         
             }      
            // var columnHeader1 = report.getColumnHeader("AdGroupName"); Таблица по группам обявлений
             // Logger.log(columnHeader1.getReportColumnName()); Таблица по группам обявлений
            //  Logger.log(columnHeader1.getBulkUploadColumnName()); Таблица по группам обявлений
            // report.exportToSheet(spreadsheet.getActiveSheet());  Таблица по группам обявлений
            // Logger.log("вот отчёт держи ->" + spreadsheet.getUrl()); Таблица по группам обявлений
      Logger.log ('Изминение ставки - Закончилось!');
             }
filterReportByLabelIds();
         // Удаление Ярлыка
 function removeLabel() {
   Logger.log ('Удаление Ярлыка - началось!');
    var groupIterator = AdsApp.adGroups()
        .withCondition(campaignStart)
        .get();
   while (groupIterator.hasNext()) {
     var groupl = groupIterator.next();
     groupl.removeLabel('Test');
   }
    Logger.log ('Удаление Ярлыка - закончилось!');
 }
 removeLabel();
}
