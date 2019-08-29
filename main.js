function main() { 
     var campaignNameInterator = AdsApp.campaigns()
     .withCondition('CampaignName CONTAINS "ek.ua - [P1] (КАТ"') // <-- СЮДА НАЗВАНИЕ РК
     .get();
   while (campaignNameInterator.hasNext()) {
      var campaignName = campaignNameInterator.next();
      var name =campaignName.getName();
      //Logger.log ('campaignName: ' + name);
     var campaignStart = 'CampaignName = "'+ name +'"';
   //  applyLabel();
     filterReportByLabelIds();
 //     removeLabel();
    }

  //Создание Ярлыка (не использую)
    function applyLabel() {
 //     Logger.log ('Сзодание Ярлыка - началось!');
    var groupI = AdsApp.adGroups()
    .withCondition(campaignStart)
        .get();
    while (groupI.hasNext()) {
      var campaign = groupI.next();
      campaign.applyLabel('Test');
    }
  //    Logger.log ('Создание Ярлыка - закончилось!');
   }


    function filterReportByLabelIds() {
  //    Logger.log ('Изминение ставки - началось!');
        var groupI = AdsApp.adGroups()
        .withCondition(campaignStart)
        .withCondition("Status = ENABLED")
        .get();
    while (groupI.hasNext()) {
      var group = groupI.next();
     // Logger.log(group.getName());
    }
      
        var query = 'SELECT CampaignName, CampaignId, AdGroupName, AdGroupId, AdGroupStatus, Clicks, Conversions, AverageCpc, CostPerAllConversion, SearchExactMatchImpressionShare, AllConversionValue, ConversionValue, Cost, AveragePosition ' +
            'FROM ADGROUP_PERFORMANCE_REPORT '+
            'WHERE  CampaignName = '+'"' + name + '"'+
            ' DURING LAST_14_DAYS';
          //   Logger.log(query);
           //  var spreadsheet = SpreadsheetApp.create("Dmitriy Test Nadavi"); Таблица по группам обявлений
             var report = AdsApp.report(query);
             var rows = report.rows();
             while (rows.hasNext()) {
             var row = rows.next();
             var CampaignName = row['CampaignName'];
         //      Logger.log(CampaignName);
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
                 var goodGroup = row['AdGroupId'];
                // Logger.log (goodGroup);
                 //бидер для групп
                 function setAdGroupDefaultCpcBid() {
                 var adGroup = AdsApp.adGroups()
                     .withCondition(campaignStart)
                     .withIds([goodGroup])
                     .get()
                     .next();
            var bid = adGroup.bidding().getCpa();
                  // Logger.log (bid);
                   var bidnew = bid*1.05;
                  // Logger.log (bidnew);
               Logger.log(CampaignName + ' |' + groupName + '|id: ' + groupIds + '| цен.конв.: ' + conversionValue + '| стоимость: ' + cost + '|ROI: ' + roi + '|клики: ' + clicks + '|cpc: ' + averageCpc + '|сред.поз.: ' + averagePosition + '|%показ.: ' + searchImpressionShare + '|OldBid: ' + bid + '|NewBid: ' + bidnew);
                adGroup.bidding().setCpa(bidnew)
               }
               setAdGroupDefaultCpcBid();
               }
               if (roi < 1 && clicks > 10) {
                 var goodGroup2 = row['AdGroupId'];
                // Logger.log (goodGroup);
                 //бидер для групп
                 function setAdGroupDefaultCpcBid2() {
                 var adGroup = AdsApp.adGroups()
                     .withCondition(campaignStart)
                     .withIds([goodGroup2])
                     .get()
                     .next();
            var bid2 = adGroup.bidding().getCpa();
                  // Logger.log (bid);
                   var bidnew2 = bid2*0.95;
                  // Logger.log (bidnew);
               Logger.log(CampaignName + ' |' + groupName + '|id: ' + groupIds + '| цен.конв.: ' + conversionValue + '| стоимость: ' + cost + '|ROI: ' + roi + '|клики: ' + clicks + '|cpc: ' + averageCpc + '|сред.поз.: ' + averagePosition + '|%показ.: ' + searchImpressionShare + '|OldBid: ' + bid2 + '|NewBid: ' + bidnew2);
                adGroup.bidding().setCpa(bidnew2)
               }
               setAdGroupDefaultCpcBid2();
               }
              }
                   
            // var columnHeader1 = report.getColumnHeader("AdGroupName"); Таблица по группам обявлений
             // Logger.log(columnHeader1.getReportColumnName()); Таблица по группам обявлений
            //  Logger.log(columnHeader1.getBulkUploadColumnName()); Таблица по группам обявлений
            // report.exportToSheet(spreadsheet.getActiveSheet());  Таблица по группам обявлений
            // Logger.log("вот отчёт держи ->" + spreadsheet.getUrl()); Таблица по группам обявлений
   //   Logger.log ('Изминение ставки - Закончилось!');
             }

         // Удаление Ярлыка (не использую)
 function removeLabel() {
 //  Logger.log ('Удаление Ярлыка - началось!');
    var groupIterator = AdsApp.adGroups()
        .withCondition(campaignStart)
        .get();
   while (groupIterator.hasNext()) {
     var groupl = groupIterator.next();
     groupl.removeLabel('Test');
   }
 //   Logger.log ('Удаление Ярлыка - закончилось!');
 }

}
