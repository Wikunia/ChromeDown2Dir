/**
 * Ole Kröger (o.kroeger@wikunia.de)
 * DownloadManager for Chrome
 * The right place for all your downloaded files
*/
chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
	// generate an array with all regular expressions and tupel of a filename part and a directory
	dirArray = [];
	dirArray[0] = [];
	// url with regex
	dirArray[0]["urlRegEx"] = /https:\/\/studip.tu-clausthal.de\/sendfile.php?(.*?)&file_name=(.*?).pdf/;
	dirArray[0]["RegExNr"] = 2; // use the second part of the regex (after file_name)
	// create the (part of filename,dir) tupel
	dirArray[0]["indexDir"] = [
								{part:"Programmierkurs",dir:"S2/Programmierkurs/"},
								{part:"Ana2",dir:"S2/Analysis/"},
							  	{part:"IN2",dir:"S2/Informatik/"},
								{part:"la2",dir:"S2/LADS/"},
								{part:"Haus%FCbung",dir:"S2/LADS/HA/"},
								{part:"Tutor%FCbung",dir:"S2/LADS/Übung/"}
							  ];
	// dir is default directory
	var dir = "";
	var break_out = false;
	// iterate through all regexes
	for (var r = 0; r < dirArray.length; r++) {
		// if regex found
		if (regex = dirArray[0]["urlRegEx"].exec(item.url)) {
			// get the right part out of the regex array
			var test_var = regex[dirArray[0]["RegExNr"]];
			/*
			console.log(dirArray[0]["indexDir"].length);
			console.log(dirArray[0]["indexDir"][0]);
			console.log(test_var);
			*/
			// iterate through all filename,dir tupel
			for (var i = 0; i < dirArray[0]["indexDir"].length; i++) {
				// if current tupel is the correct one (part is a part of the filename)
				if (test_var.indexOf(dirArray[0]["indexDir"][i].part) != -1) {
					dir = dirArray[0]["indexDir"][i].dir;
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
