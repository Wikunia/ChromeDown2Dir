/**
 * Ole Kröger (o.kroeger@wikunia.de)
 * DownloadManager for Chrome
 * The right place for all your downloaded files
*/
chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
	// generate an array with all regular expressions and tupel of a filename part and a directory
	dirArray = [];
	dirArray[0] = [];
	dirArray[1] = [];
	// url with regex
	dirArray[0]["urlRegEx"] = /https:\/\/studip.tu-clausthal.de\/sendfile.php?(.*?)&file_name=(.*?).pdf/;
	dirArray[0]["RegExNr"] = 2; // use the second part of the regex (after file_name)
	// create the (part of filename,dir) tupel
	dirArray[0]["indexDir"] = [
								{part:"Programmierkurs",dir:"Documents/CLZ/TUC/S2/Programmierkurs/"},
								{part:"Ana2",dir:"Documents/CLZ/TUC/S2/Analysis/"},
							  	{part:"IN2",dir:"Documents/CLZ/TUC/S2/Informatik/"},
								{part:"la2",dir:"Documents/CLZ/TUC/S2/LADS/"},
								{part:"Haus%FCbung",dir:"Documents/CLZ/TUC/S2/LADS/HA/"},
								{part:"Tutor%FCbung",dir:"Documents/CLZ/TUC/S2/LADS/Übung/"}
							  ];
	dirArray[1]["urlRegEx"] = /http:\/\/visualizing.org\/sites\/default\/files\/data_set\/(.*)\/(.*?)/;
	dirArray[1]["RegExNr"] = 1; // use the second part of the regex (after file_name)
	dirArray[1]["indexDir"] = [
								{part:"",dir:"Documents/Visualizing/!part!/"},
							  ];

	// dir is default directory
	var dir = "Downloads/";
	var break_out = false;
	// iterate through all regexes
	for (var r = 0; r < dirArray.length; r++) {
		// if regex found
		if (regex = dirArray[r]["urlRegEx"].exec(item.url)) {
			// get the right part out of the regex array
			var test_var = regex[dirArray[r]["RegExNr"]];
			/*
			console.log(dirArray[r]["indexDir"].length);
			console.log(dirArray[r]["indexDir"][0]);
			console.log(test_var);
			*/
			// iterate through all filename,dir tupel
			for (var i = 0; i < dirArray[r]["indexDir"].length; i++) {
				if (dirArray[r]["indexDir"][i].part == "") {
						dirArray[r]["indexDir"][i].part = test_var;
				}
				dirArray[r]["indexDir"][i].dir = urldecode(dirArray[r]["indexDir"][i].dir.replace('!part!',dirArray[r]["indexDir"][i].part));

				// if current tupel is the correct one (part is a part of the filename)
				if (test_var.indexOf(dirArray[r]["indexDir"][i].part) != -1) {
					dir = dirArray[r]["indexDir"][i].dir;
					break_out = true;
					break;
				}
			}
		}
		if (break_out) {
			break;
		}
	}
	if (!break_out) {
		console.log("Different url => no regular expression found");
	}
		

	suggest({filename: dir+item.filename,
		   conflict_action: 'overwrite',
		   conflictAction: 'overwrite'});
 
});


function urldecode(url) {
  return decodeURIComponent(url.replace(/\+/g, ' '));
}
