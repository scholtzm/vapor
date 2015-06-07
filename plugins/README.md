# Vapor Plugins Folder

All Vapor plugins should keep their extra files in this folder.

### Usage

If a plugin needs to store any extra files, it should use this folder
and create another subfolder specifically for its use.

There's a helper method available in `Vapor.extension`.

#### `Vapor.extension.getPluginFolderPath(pluginName)` -> string

This function will create subfolder (if it doesn't exist) for the give `pluginName`
and then return the full path to specific plugin folder.
