"use strict";

var _fb = new Firebase('https://event-guest-data.firebaseio.com/'),
    none = '<h6 id="no-data" class="center"><br/>-- Be the first one to sign. --<br/></h6>';

$(document).ready(function () {

    if( !$('#attendees li').length ){
        $('#none').append(none);
    }

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
            return Materialize.toast('Please input your name !', 2000);
        }
        if(!organization){
            return Materialize.toast('Please input your organization !', 2000);
        }
        if(!contact){
            return Materialize.toast('Please input your contact number !', 2000);
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

        return Materialize.toast( name + ' from ' + organization + ' added !', 2000);
    }


    function addData(data) {
        var guest = data.val(),
            id = data.key(),
            none = $('#no-data');

        if(none){
            none.remove();
        }

        $('#attendees')
            .append([
                '<li id="', id ,'">',
                    '<div class="collapsible-header truncate">', guest.name ,
                        '<i id="delete-', id ,'" class="material-icons right red">cancel</i>',
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
            ].join(''));


        $('#'+id).hover(
            function() {
                $('#delete-'+id).show();
            },
            function() {
                $('#delete-'+id).hide();
            }
        );

        $('#delete-'+id).hide();

        $('#delete-'+id)
            .click( function() {
                _fb
                    .child(id)
                    .remove( function (err) {
                        if (err) {
                            return Materialize.toast('Removing ' + guest.name + ' failed. Please try again.', 2000);
                        }
                    });

                return Materialize.toast( guest.name + ' from ' + guest.organization + ' removed !', 2000);
            });

    }

    function removeData(data) {
        var id = data.key();

        $('#'+id).remove();

        if( !$('#attendees li').length ){
            $('#none').append(none);
        }
    }

});