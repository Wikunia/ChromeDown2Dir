/**
 * Ole Kröger (o.kroeger@wikunia.de)
 * DownloadManager for Chrome
 * The right place for all your downloaded files
*/
chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
	console.log(item);

	// generate an array with all regular expressions and tupel of a filename part and a directory
	dirArray = [];
	dirArray[0] = [];
	dirArray[1] = [];
	dirArray[2] = [];
	// url with regex
	dirArray[0]["urlRegEx"] = /https:\/\/studip.tu-clausthal.de\/sendfile.php?(.*?)&file_name=(.*?).pdf/;
	dirArray[0]["indexDir"] = [
								{url:[,,"Programmierkurs"],dir:"Documents/CLZ/TUC/S2/Programmierkurs/"},
								{url:[,,"Ana2"],dir:"Documents/CLZ/TUC/S2/Analysis/"},
							  	{url:[,,"IN2"],dir:"Documents/CLZ/TUC/S2/Informatik/"},
								{url:[,,"la2"],dir:"Documents/CLZ/TUC/S2/LADS/"},
								{url:[,,"Haus%FCbung"],dir:"Documents/CLZ/TUC/S2/LADS/HA/"},
								{url:[,,"Tutor%FCbung"],dir:"Documents/CLZ/TUC/S2/LADS/Übung/"}
							  ];
	dirArray[1]["urlRegEx"] = /http:\/\/visualizing.org\/sites\/default\/files\/data_set\/(.*)\/(.*?)/;
	dirArray[1]["indexDir"] = [
								{dir:"Documents/Visualizing/!url[1]!/"}
							  ];

	dirArray[2]["urlRegEx"] = /http:\/\/(.*?).convert2mp3.net\/download.php/;
	dirArray[2]["filenameRegEx"] = /(.*?) - (.*?)\.mp3/;
	dirArray[2]["indexDir"] = [
								{dir:"Music/!file[1]!/"}
							  ];

	// dir is default directory
	var dir = "Downloads/";
	var break_out = false;
	var fileRegexFound = false;
	// iterate through all regexes
	for (var r = 0; r < dirArray.length; r++) {
		if (dirArray[r]["filenameRegEx"]) {
			if (fileRegex = dirArray[r]["filenameRegEx"].exec(item.filename)) {
				fileRegexFound = true;
			}
		}
		// if regex found
		if (urlRegex = dirArray[r]["urlRegEx"].exec(item.url)) {
			// iterate through all filename,dir tupel
			for (var i = 0; i < dirArray[r]["indexDir"].length; i++) {
				// check if entry has a url part
				if (dirArray[r]["indexDir"][i].url) {
					for (var u = 0; u < dirArray[r]["indexDir"].url.length; u++) {
						if (urlRegex[u] == dirArray[r]["indexDir"][i].url[u]) {
							dir = dirArray[r]["indexDir"][i].dir;
							break_out = true;
							break;
						}
						if (break_out) {
							break;
						}
					}
				} else {dir = dirArray[r]["indexDir"][i].dir; break_out = true; }
				dir = dir.replace(/!url\[([0-9]*?)\]!/,function(str,p1,offset,s) { return urlRegex[p1]; });
				if (fileRegexFound) {
					dir = dir.replace(/!file\[([0-9]*?)\]!/,function(str,p1,offset,s) { return fileRegex[p1]; });
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
