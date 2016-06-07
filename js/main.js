
var myUsers = ["kolento", "bmkibler", "nl_kripp", "savj", "forsenlol", "thijshs", "reynad27", "day9tv", "eloise_ailv", "gaarabestshaman", "itshafu", "hotform", "j4ckiechan", "radu_hs", "amazhs", "reckful", "trumpsc", "lotharhs", "orange_hs", "sjow", "xixo", "zalaehs", "mryagut", "chancedies", "hero_firebat", "noxious_hs", "zetalot", "strifecro", "lifecoach1981", "comster404", "freecodecamp", "brunofin"];
var userData = [];
var htmlOffline = "";
var htmlOnline = "";
var htmlInactive = "";
var count = 0;
var inactiveUsers = [];

function renderList(str) { // This function merely
  // renders and shows the list.
  $(".groups").show();
  $(".search-group").hide();
  $(".clear-skies").hide();
  str = str === undefined ? "All" : str.trim();

  switch (str) {
    case "All":
      if (htmlOnline + htmlOffline + htmlInactive != "") {
        if (htmlOnline != "") {
          $(".online-container").html(htmlOnline);
          $(".online-container").show();
          $(".online-title").show();
        } else {
          $(".online-container").hide();
          $(".online-title").hide();
          $(".online-container").html("");
        }
        if (htmlOffline != "") {
          $(".offline-container").html(htmlOffline);
          $(".offline-container").show();
          $(".offline-title").show();
        } else {
          $(".offline-container").hide();
          $(".offline-title").hide();
          $(".offline-container").html("");
        }
        if (htmlInactive != "") {
          $(".inactive-container").html(htmlInactive);
          $(".inactive-container").show();
          $(".inactive-title").show();
        } else {
          $(".inactive-container").hide();
          $(".inactive-title").hide();
          $(".inactive-container").html("");
        }
      } else {
        $(".online-container").hide();
        $(".online-title").hide();
        $(".offline-container").hide();
        $(".offline-title").hide();
        $(".inactive-container").hide();
        $(".inactive-title").hide();
        $(".clear-skies").css({
          "display": "flex"
        });
        $(".clear-skies > p").text("There's nothing here!");
      }
      if (inactiveUsers.length > 0) {
        $(".inactive-number").text(inactiveUsers.length);
        $(".inactive-word").text(inactiveUsers.length === 1 ? "account" : "accounts");
        $(".them-it").text(inactiveUsers.length === 1 ? "it" : "them");
        $(".black-head").show();
      }
      break;
    case "Online":
      if (htmlOnline != "") {
        $(".online-container").html(htmlOnline);
        $(".online-container").show();
        $(".online-title").show();
      } else {
        $(".online-container").hide();
        $(".online-title").hide();
        $(".clear-skies").css({
          "display": "flex"
        });
        $(".clear-skies > p").text(myUsers.length === 0 ? "There's nothing here! Try adding your favorite Twitch channels." : "None of the channels you are monitoring are online.");
      }
      $(".offline-container").hide();
      $(".offline-title").hide();
      $(".inactive-container").hide();
      $(".inactive-title").hide();
      break;
    case "Offline":
      $(".online-container").hide();
      $(".online-title").hide();
      if (htmlOffline != "") {
        $(".offline-container").html(htmlOffline);
        $(".offline-container").show();
        $(".offline-title").show();
      } else {
        $(".offline-container").hide();
        $(".offline-title").hide();
        $(".clear-skies").css({
          "display": "flex"
        });
        $(".clear-skies > p").text(myUsers.length === 0 ? "There's nothing here! Try adding your favorite Twitch channels." : "None of the channels you are monitoring are offline.");
      }
      $(".inactive-container").hide();
      $(".inactive-title").hide();
  }
  $(".toggle-bar").show();

}

function populateList(searchQuery) { // This function grabs the data from
  // The API and creates the list.

  var list = myUsers;
  if (searchQuery) {
    $(".online-group").hide();
    $(".offline-group").hide();
    $(".inactive-group").hide();
    $(".search-group").show();
  } else {
    userData = [];
    htmlOffline = "";
    htmlOnline = "";
    htmlInactive = "";
    inactiveUsers = [];
    count = 0;
    if (list.length === 0) {
      renderList();
    }
    list.forEach(function(username) {
      $.getJSON('https://api.twitch.tv/kraken/streams/' +
        username +
        '?callback=?',
        function(data) {
          if (data.hasOwnProperty("stream")) { // If there is stream data, parse it.
            $.getJSON('https://api.twitch.tv/kraken/channels/' +
              username +
              '?callback=?',
              function(channel) {
                if (data.stream == null) {
                  htmlOffline += "<br><div><a href='http://twitch.tv/" + username + "/profile' target='_blank'><span class='picture'><img src='" + (channel.logo == null ? "https://www.jobvizz.com/images/member-profile-picture-placeholder1.png" : channel.logo) + "'></span><span class='name'>  " + channel.display_name + "   </span></a><span class='status'><!-- offline --></span></div><br>"
                  count++;

                  if (count == list.length) {
                    renderList($(".active").text());
                  };
                  userData.push(data);
                } else { // Else, add the user to the online list.
                  userData.push(data);
                  htmlOnline += "<br><div><a href='http://twitch.tv/" + username + "/profile' target='_blank'><span class='picture'><img src='" + (channel.logo == null ? "https://www.jobvizz.com/images/member-profile-picture-placeholder1.png" : channel.logo) + "'></span><span class='name'>  " + channel.display_name + " is now playing" + "    </span></a><span class='status'><a href='http://twitch.tv/" + username + "' target='_blank'>" + data.stream.game + "</a></span></div><br>"
                  count++;

                  if (count == list.length) {
                    renderList($(".active").text());
                  };
                }
              })

          } else {
            htmlInactive += "<br><div><span class='picture'><img src='" + "https://www.jobvizz.com/images/member-profile-picture-placeholder1.png" + "'></span><span class='name inactive'>" + " " + username + "</span><span class='status'><!-- inactive --></span></div>"
            inactiveUsers.push(username);
            count++;
            if (count == list.length) {
              renderList($(".active").text());
            };
            userData.push(data); // Adds the user to the inactive list.
          }
        });
    });
  }
}

$(document).ready(function() {
$("#custom-preview").hide();

  populateList();

  $('.content').on('click', '.clear', function() {
    linkVal = $(this).siblings("a").text().toLowerCase();
    spanVal = $(this).siblings("span").text().toLowerCase()

    myUsers.splice(myUsers.indexOf(linkVal ? linkVal : spanVal), 1);
    if ($(this).parent().parent().children().length === 1) {
      $(this).parent().parent().parent().hide();
      populateList();
      $(".black-head").hide();
    }
    $(this).parent().remove();
  });

$(".toggle").click(function() {
 $(".active").removeClass("active");
  $(this).addClass("active");
  renderList($(this).text());
  });
});
