"use strict";

var _fb = new Firebase('https://event-guest-data.firebaseio.com/');

$(document).ready(function () {

    $('.collapsible').collapsible({
        accordion : false
    });

    $('.collapsible').css('box-shadow','none');

    $('#add-guest')
        .click(addNewGuest);

    $(':input','#guest-form')
        .keypress(function (e) {
            if (e.keyCode == 13) {
                addNewGuest();
            }
        });

    _fb
        .orderByChild('name')
        .on('child_added', addData);
    _fb
        .on('child_removed', removeData);




    function addNewGuest(){
        var name = $('#name').val(),
            organization = $('#org').val(),
            contact = $('#contact').val(),
            date = new Date().toString().split(' ').splice(1,3).join(' '),
            time = new Date().toTimeString().split(" ")[0];


        if(!name){
            return Materialize.toast('Please input your name !', 2500);
        }
        if(!organization){
            return Materialize.toast('Please input your organization !', 2500);
        }
        if(!contact){
            return Materialize.toast('Please input your contact number !', 2500);
        }

        _fb.push(
            {
                name: name,
                organization: organization,
                contact: contact,
                __dateAttended: date,
                __timeAttended: time
            }
        );

        $(':input','#guest-form')
          .not(':button, :submit, :reset, :hidden')
          .val('')
          .removeAttr('checked')
          .removeAttr('selected');

        return Materialize.toast( name + ' from ' + organization + ' added !', 2500);
    }


    function addData(data) {
        var guest = data.val(),
            id = data.key(),
            none = $('#none');

        if(none){
            none.remove();
        }

        $('#attendees')
            .append([
                '<li id="', id ,'">',
                    '<div class="collapsible-header truncate">', guest.name ,
                        '<i class="material-icons right red">cancel</i>',
                    '</div>',
                    '<div class="collapsible-body">',
                        '<ul class="guest-info">',
                            '<li>Organization : '   , guest.organization    , '</li>',
                            '<li>Contact No : '     , guest.contact         ,'</li>',
                            '<li>Date Attended : '  , guest.__dateAttended  ,'</li>',
                            '<li>Time Attended : '  , guest.__timeAttended  ,'</li>',
                        '</ul>',
                    '</div>',
                '</li>'
            ].join(' '));


    }

    function removeData(data) {

    }

});