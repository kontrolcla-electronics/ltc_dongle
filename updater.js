var ID = function(elementId) {
    return document.getElementById(elementId);
};
const ct = ID('ct_id');
const linkEl = document.head.querySelector('link[href*="style.css"]');
const modal = document.getElementsByClassName('modal')[0];
const modal_wait = document.getElementsByClassName('modal')[1];
const fn = ID("fn"); but = ID("bt"), txt = ID("txt"), txt_2 = ID("txt_2");
const txt_modal = ID("txt_modal");
const max_bytes_recv = 1024;
//
const str_msg_100 = "Reading ";
const str_msg_101 = "Uploading ";
const str_msg_102 = "Update done ! - re starting the box";
const str_fail = "Something went wrong - Try again - Reload the?2age ";
const str_focus = "keep this window in focus";
//
var get_serial_interval = 0;
var file_data, file_size, page_number, page_size = 256, ip;
//************************************************
var bt = function() 
{ fn.click();
};

var oC = function() 
{ var r = new FileReader();
  //r.readAsText(fn.files[0]);
  r.readAsArrayBuffer(fn.files[0]);
  file_size = fn.files[0].size;
  r.onload = function()
  { // check sigui multiple de page_size
    if ( file_size % page_size == 0 )
    { file_data = r.result;
      page_number = ( file_size / page_size ) - 1;
      send(0);
    }
    else
      txt.innerText = "Invalid file";
  };  
};
//*********
function send(index) 
{ var params;
  but.disabled = true;
  var start = index * page_size;
  var end = (index+1) * page_size;
  // es un array buffer 
  params = file_data.slice( start, ( end ) );
  send_serial( params, page_size );
}
//*********
// CALLBACK
function parse_frame(frame) 
{ var data = JSON.parse(frame);
  if ( data != "") 
  { if ( data.action == "updater" )
    { var idx = '';
      if (data.idx != undefined )
      { idx = data.idx;  
        send( parseInt(idx) );
      }
      if ( data.msg != undefined )
      { switch ( parseInt(data.msg) )
        {  case 100:
            txt.innerText = str_msg_100 + idx + " / " + page_number;
            txt_2.innerText = str_focus;
            break;
          case 101:
            if ( idx == page_number )
            { txt.innerText = "Verifying";
              txt_2.innerText = "wait...";
            }
            else
            { txt.innerText = str_msg_101 + idx + " / " + page_number;
              txt_2.innerText = str_focus;
            }
            break;
          case 102:
            txt.innerText = str_msg_102;
            txt_2.innerText = "";
            break;
          case (2000):
          case (2001):
          case (2002):
          case (2003):
          case (2004):
          case (2005):
            txt.innerText = str_fail;
            break;
        }
        if ( parseInt(data.msg) == 102 )
          window.setTimeout(end, 5000);
      }     
    }
    else if ( data.action == "going_to_update_mode" )
    {   modal.style.display = "none";
        modal_wait.style.display = "block";
        window.setTimeout( updater, 4000 );
    }
  }
}
//*********
function end()
{   ct.style.display = "none";
}
//*********
function updater()
{   modal.style.display = "block";
    txt_modal.innerText = "Run Updater";
    modal_wait.style.display = "none";
}
//*********
const serial_obj = new serial_class();
const connect = document.getElementById('connect');
const recv_div = document.getElementById('recv_div');

connect.addEventListener('pointerdown', () => {
  serial_obj.init().then(() => 
  { get_serial_interval = window.setInterval(getSerialMessage, 100) 
    console.log ( "open port" );
    if( txt_modal.innerText == "Run Updater" )
    {   ct.style.display = "block";
        modal.style.display = "none";
        
    }
    else if ( txt_modal.innerText == "Go To Update Mode" )
    {   window.setTimeout( send_format_timecode_string, 1000 );
        window.setTimeout( send_goto_updater, 5000 );
        txt_modal.innerText = "connecting..."
    }
  }); 
});
//*********
function send_format_timecode_string()
{   var command = "set_format_timecode=string\r";
    serial_obj.write( command );
    console.log ( command );
}
//*********
function send_goto_updater()
{   var command = "goto_updater\r";
    serial_obj.write( command );
    console.log ( command );
}
//*********
var data_recv = "";
var data_saved = "";
var data_array = [];

async function getSerialMessage() 
{ var data = await serial_obj.read();
  if( data == "$lost$" )
  { clearInterval(get_serial_interval);
    get_serial_interval = 0;
    return;
  }
  var now = get_time();
  console.log ( now + " - recv data len: " + data.length );
  var index = data.indexOf('\r');
  while ( index != -1 )
  { data_recv = data_saved;
    data_recv += data.slice(0, index);
    // quedara
    data_saved = "";
    data = data.slice(index+1);
    // task parse
    var now = get_time();
    console.log ( now + " - data_recv: " + data_recv );
    parse_frame(data_recv);
    //
    index = data.indexOf('\r');
  }
  if ( data )    
  { // es part del frame
    data_saved += data;
  }
  // per seguretat
  if ( data_saved.length > max_bytes_recv )
  { console.log ( now + " - data recv overflow: emptied\n" );
    data_saved = "";
  }
}
//*********
function send_serial( data_bytes, len )
{ var now = get_time();
  if ( get_serial_interval == 0 )
  { console.log( now + " - no serial connection");
    return;
  }
  var len_hex = ('0000' + len.toString(16).toUpperCase()).slice(-4);
  var header = "POST_" + len_hex;
  header += "_updater:";
  serial_obj.write( header, data_bytes );
  console.log( now + " - serial_write - " + len + " bytes" ); 
  
}
//**********
function addZero(i) {
  if (i < 10) {i = "0" + i}
  return i;
}
function get_time()
{ const d = new Date();
  let h = addZero(d.getHours());
  let m = addZero(d.getMinutes());
  let s = addZero(d.getSeconds());
  let ms = d.getMilliseconds();
  let time = h + ":" + m + ":" + s + '.' + ms;
  return time;
}
//**********
modal.style.display = "block";