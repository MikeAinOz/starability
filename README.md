# starability
Starability is a Custom Power BI Visual from ParadigmBI
It is for rating Power BI pages the stars are from https://github.com/LunarLogic/starability
This is a demonstration module for https://paradigmbi.com.au/
This is all open source, please feel free to play with the code and acknowledge the sources, which are varied.

This visual sends a star rating to a URL, we've been using Microsoft Flow to test this
The JSON looks like this:  { id: entityid, value : val , userName : userName   }
This should be self-explanatory, but feel free to ask questions. 

There is a single field for the user name, create a text measure for this like this : UserName = USERNAME() and put the measure in the username field.

On the Format pane, enter the URL of the Flow or whatever web service you want to use,and put a page name in the page name field
