Ltc dongle - firmware updating

How to update:
https://youtu.be/2TkiVayBgE8?si=vIxxKJqfRPf2OWPC

-------------------------------------------

Available configuration commands with example of answers after the symbol =>

set_format_timecode=blocks\r
    or
set_format_timecode=string\r =>
    {"set_format_time code":"ok"}\r

get_format_timecode\r =>
    {"format_timecode":"blocks"}\r
    or
    {"format_timecode":"string"}\r

set_oled_brightness=4\r ( 1 to 16 ) =>
    {"set_oled":"ok"}\r

get_oled_brightness\r =>
    {"oled_brightness":4}\r

set_oled_orientation=1\r  ( 0: rotating 180 degrees every time by the touch, 1: 0 degrees fixed, 2: 180 degrees fixed ) =>
    {"set_oled":"ok"}\r

get_oled_orientation\r =>
    {"oled_orientation":0}\r

get_firmware\r =>
    {"firmware":"028.000.00.043","boot loader":"051.000.00.002"}\r

get_blocks_parameters\r =>
    {"i":0,"w":100,"t":30,"c":1,"n":1,"f":2}\r

save_cfg\r ( permanent into the micro controller internal flash - max 3 times before a re power is needed ) =>
    {"save_cfg":"ok"}\r

