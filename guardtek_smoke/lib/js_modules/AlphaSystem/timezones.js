/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1-vsdoc.js" />
/// <reference path="lib/AlphaSystem/alphaClass.js" />
/*
* File Created: aout 27, 2013
* Abderraouf El Gasser
* Copyright 2013 Alphasystem S.A.S.
*/
(function (window, undefined) {
    var _Timezones = [
  {
      "id": "Dateline Standard Time",
      "index": "000",
      "text": "(GMT-12:00) International Date Line West"
  },
  {
      "id": "Samoa Standard Time",
      "index": "001",
      "text": "(GMT-11:00) Midway Island, Samoa"
  },
  {
      "id": "Hawaiian Standard Time",
      "index": "002",
      "text": "(GMT-10:00) Hawaii"
  },
  {
      "id": "Alaskan Standard Time",
      "index": "003",
      "text": "(GMT-09:00) Alaska"
  },
  {
      "id": "Pacific Standard Time",
      "index": "004",
      "text": "(GMT-08:00) Pacific Time (US and Canada); Tijuana"
  },
  {
      "id": "Mountain Standard Time",
      "index": "010",
      "text": "(GMT-07:00) Mountain Time (US and Canada)"
  },
  {
      "id": "Mexico Standard Time 2",
      "index": "013",
      "text": "(GMT-07:00) Chihuahua, La Paz, Mazatlan"
  },
  {
      "id": "U.S. Mountain Standard Time",
      "index": "015",
      "text": "(GMT-07:00) Arizona"
  },
  {
      "id": "Central Standard Time",
      "index": "020",
      "text": "(GMT-06:00) Central Time (US and Canada"
  },
  {
      "id": "Canada Central Standard Time",
      "index": "025",
      "text": "(GMT-06:00) Saskatchewan"
  },
  {
      "id": "Mexico Standard Time",
      "index": "030",
      "text": "(GMT-06:00) Guadalajara, Mexico City, Monterrey"
  },
  {
      "id": "Central America Standard Time",
      "index": "033",
      "text": "(GMT-06:00) Central America"
  },
  {
      "id": "Eastern Standard Time",
      "index": "035",
      "text": "(GMT-05:00) Eastern Time (US and Canada)"
  },
  {
      "id": "U.S. Eastern Standard Time",
      "index": "040",
      "text": "(GMT-05:00) Indiana (East)"
  },
  {
      "id": "S.A. Pacific Standard Time",
      "index": "045",
      "text": "(GMT-05:00) Bogota, Lima, Quito"
  },
  {
      "id": "Atlantic Standard Time",
      "index": "050",
      "text": "(GMT-04:00) Atlantic Time (Canada)"
  },
  {
      "id": "S.A. Western Standard Time",
      "index": "055",
      "text": "(GMT-04:00) Caracas, La Paz"
  },
  {
      "id": "Pacific S.A. Standard Time",
      "index": "056",
      "text": "(GMT-04:00) Santiago"
  },
  {
      "id": "Newfoundland and Labrador Standard Time",
      "index": "060",
      "text": "(GMT-03:30) Newfoundland and Labrador"
  },
  {
      "id": "E. South America Standard Time",
      "index": "065",
      "text": "(GMT-03:00) Brasilia"
  },
  {
      "id": "S.A. Eastern Standard Time",
      "index": "070",
      "text": "(GMT-03:00) Buenos Aires, Georgetown"
  },
  {
      "id": "Greenland Standard Time",
      "index": "073",
      "text": "(GMT-03:00) Greenland"
  },
  {
      "id": "Mid-Atlantic Standard Time",
      "index": "075",
      "text": "(GMT-02:00) Mid-Atlantic"
  },
  {
      "id": "Azores Standard Time",
      "index": "080",
      "text": "(GMT-01:00) Azores"
  },
  {
      "id": "Cape Verde Standard Time",
      "index": "083",
      "text": "(GMT-01:00) Cape Verde Islands"
  },
  {
      "id": "GMT Standard Time",
      "index": "085",
      "text": "(GMT) Greenwich Mean Time: Dublin, Edinburgh, Lisbon, London"
  },
  {
      "id": "Greenwich Standard Time",
      "index": "090",
      "text": "(GMT) Casablanca, Monrovia"
  },
  {
      "id": "Central Europe Standard Time",
      "index": "095",
      "text": "(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague"
  },
  {
      "id": "Central European Standard Time",
      "index": "100",
      "text": "(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb"
  },
  {
      "id": "Romance Standard Time",
      "index": "105",
      "text": "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris"
  },
  {
      "id": "W. Europe Standard Time",
      "index": "110",
      "text": "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna"
  },
  {
      "id": "W. Central Africa Standard Time",
      "index": "113",
      "text": "(GMT+01:00) West Central Africa"
  },
  {
      "id": "E. Europe Standard Time",
      "index": "115",
      "text": "(GMT+02:00) Bucharest"
  },
  {
      "id": "Egypt Standard Time",
      "index": "120",
      "text": "(GMT+02:00) Cairo"
  },
  {
      "id": "FLE Standard Time",
      "index": "125",
      "text": "(GMT+02:00) Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius"
  },
  {
      "id": "GTB Standard Time",
      "index": "130",
      "text": "(GMT+02:00) Athens, Istanbul, Minsk"
  },
  {
      "id": "Israel Standard Time",
      "index": "135",
      "text": "(GMT+02:00) Jerusalem"
  },
  {
      "id": "South Africa Standard Time",
      "index": "140",
      "text": "(GMT+02:00) Harare, Pretoria"
  },
  {
      "id": "Russian Standard Time",
      "index": "145",
      "text": "(GMT+03:00) Moscow, St. Petersburg, Volgograd"
  },
  {
      "id": "Arab Standard Time",
      "index": "150",
      "text": "(GMT+03:00) Kuwait, Riyadh"
  },
  {
      "id": "E. Africa Standard Time",
      "index": "155",
      "text": "(GMT+03:00) Nairobi"
  },
  {
      "id": "Arabic Standard Time",
      "index": "158",
      "text": "(GMT+03:00) Baghdad"
  },
  {
      "id": "Iran Standard Time",
      "index": "160",
      "text": "(GMT+03:30) Tehran"
  },
  {
      "id": "Arabian Standard Time",
      "index": "165",
      "text": "(GMT+04:00) Abu Dhabi, Muscat"
  },
  {
      "id": "Caucasus Standard Time",
      "index": "170",
      "text": "(GMT+04:00) Baku, Tbilisi, Yerevan"
  },
  {
      "id": "Transitional Islamic State of Afghanistan Standard Time",
      "index": "175",
      "text": "(GMT+04:30) Kabul"
  },
  {
      "id": "Ekaterinburg Standard Time",
      "index": "180",
      "text": "(GMT+05:00) Ekaterinburg"
  },
  {
      "id": "West Asia Standard Time",
      "index": "185",
      "text": "(GMT+05:00) Islamabad, Karachi, Tashkent"
  },
  {
      "id": "India Standard Time",
      "index": "190",
      "text": "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi"
  },
  {
      "id": "Nepal Standard Time",
      "index": "193",
      "text": "(GMT+05:45) Kathmandu"
  },
  {
      "id": "Central Asia Standard Time",
      "index": "195",
      "text": "(GMT+06:00) Astana, Dhaka"
  },
  {
      "id": "Sri Lanka Standard Time",
      "index": "200",
      "text": "(GMT+06:00) Sri Jayawardenepura"
  },
  {
      "id": "N. Central Asia Standard Time",
      "index": "201",
      "text": "(GMT+06:00) Almaty, Novosibirsk"
  },
  {
      "id": "Myanmar Standard Time",
      "index": "203",
      "text": "(GMT+06:30) Yangon Rangoon"
  },
  {
      "id": "S.E. Asia Standard Time",
      "index": "205",
      "text": "(GMT+07:00) Bangkok, Hanoi, Jakarta"
  },
  {
      "id": "North Asia Standard Time",
      "index": "207",
      "text": "(GMT+07:00) Krasnoyarsk"
  },
  {
      "id": "China Standard Time",
      "index": "210",
      "text": "(GMT+08:00) Beijing, Chongqing, Hong Kong SAR, Urumqi"
  },
  {
      "id": "Singapore Standard Time",
      "index": "215",
      "text": "(GMT+08:00) Kuala Lumpur, Singapore"
  },
  {
      "id": "Taipei Standard Time",
      "index": "220",
      "text": "(GMT+08:00) Taipei"
  },
  {
      "id": "W. Australia Standard Time",
      "index": "225",
      "text": "(GMT+08:00) Perth"
  },
  {
      "id": "North Asia East Standard Time",
      "index": "227",
      "text": "(GMT+08:00) Irkutsk, Ulaanbaatar"
  },
  {
      "id": "Korea Standard Time",
      "index": "230",
      "text": "(GMT+09:00) Seoul"
  },
  {
      "id": "Tokyo Standard Time",
      "index": "235",
      "text": "(GMT+09:00) Osaka, Sapporo, Tokyo"
  },
  {
      "id": "Yakutsk Standard Time",
      "index": "240",
      "text": "(GMT+09:00) Yakutsk"
  },
  {
      "id": "A.U.S. Central Standard Time",
      "index": "245",
      "text": "(GMT+09:30) Darwin"
  },
  {
      "id": "Cen. Australia Standard Time",
      "index": "250",
      "text": "(GMT+09:30) Adelaide"
  },
  {
      "id": "A.U.S. Eastern Standard Time",
      "index": "255",
      "text": "(GMT+10:00) Canberra, Melbourne, Sydney"
  },
  {
      "id": "E. Australia Standard Time",
      "index": "260",
      "text": "(GMT+10:00) Brisbane"
  },
  {
      "id": "Tasmania Standard Time",
      "index": "265",
      "text": "(GMT+10:00) Hobart"
  },
  {
      "id": "Vladivostok Standard Time",
      "index": "270",
      "text": "(GMT+10:00) Vladivostok"
  },
  {
      "id": "West Pacific Standard Time",
      "index": "275",
      "text": "(GMT+10:00) Guam, Port Moresby"
  },
  {
      "id": "Central Pacific Standard Time",
      "index": "280",
      "text": "(GMT+11:00) Magadan, Solomon Islands, New Caledonia"
  },
  {
      "id": "Fiji Islands Standard Time",
      "index": "285",
      "text": "(GMT+12:00) Fiji Islands, Kamchatka, Marshall Islands"
  },
  {
      "id": "New Zealand Standard Time",
      "index": "290",
      "text": "(GMT+12:00) Auckland, Wellington"
  },
  {
      "id": "Tonga Standard Time",
      "index": "300",
      "text": "(GMT+13:00) Nuku'alofa"
  }
];

  AlphaClass.registerNamespace('Fr.Alphasystem.Report.Web.Constants');
  window.Fr.Alphasystem.Report.Web.Constants.Timezones = _Timezones;
})(window);


/**Source:

http://msdn.microsoft.com/en-us/library/ms912391(v=winembedded.11).aspx

(function(e) {
    var tz = [];
    $("[id='content'] > div:nth-child(2) > table > tbody > tr").each(function(index) {
      if( index > 0 ) {
        var cells = $(this).find("td");
        tz.push({id: cells[1].innerText, index: cells[0].innerText, text: cells[2].innerText});        
      }
    });
    
    console.log(JSON.stringify(tz));
})

*/