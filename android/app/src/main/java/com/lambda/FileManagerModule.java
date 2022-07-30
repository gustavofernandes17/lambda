package com.lambda;

import static android.os.Environment.DIRECTORY_MUSIC;

import android.app.DownloadManager;
import android.content.Context;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import com.tonyodev.fetch2.Download;
import com.tonyodev.fetch2.Error;
import com.tonyodev.fetch2.Fetch;
import com.tonyodev.fetch2.FetchConfiguration;
import com.tonyodev.fetch2.FetchListener;
import com.tonyodev.fetch2.NetworkType;
import com.tonyodev.fetch2.Priority;
import com.tonyodev.fetch2.Request;
import com.tonyodev.fetch2core.DownloadBlock;

public class FileManagerModule extends ReactContextBaseJavaModule {
  
  File defaultDirectory = Environment.getExternalStoragePublicDirectory(DIRECTORY_MUSIC);

  Fetch fetch;
  
  FileManagerModule(ReactApplicationContext context) {
    super(context);
  }
  
  @Override
  public String getName() {
    return "FileManagerModule";
  }
  

  @ReactMethod
  public void deleteMusicFile(String path, Promise promise) {
    Log.d("FileManager", "Tentando Excluir");
    try {

      File musicFile = new File(path);

      Log.d("FileManager", "the file exists: " + musicFile.exists());
      
      Boolean deletionResult = musicFile.delete(); 
      Log.d("FileManager", path);
      Log.d("FileManager", musicFile.toString());
      
      promise.resolve(deletionResult);
      Log.d("FileManager", "Resultado: " + deletionResult);
    } catch(Exception err) {
      Log.d("FileManager", "Algo deu errado");
      promise.reject(err); 
    }
  }

  @ReactMethod
  public void changeBaseDownloadDirectory(String newBaseDownloadDirectory, Promise promise) {
    try { 
      // Se o diretorio existir salveo
      if (Files.exists(Paths.get(newBaseDownloadDirectory))) {
        this.defaultDirectory = new File(newBaseDownloadDirectory);
        promise.resolve(true);
      } else {
        promise.resolve(false);
      }

    } catch(Exception err) {
      promise.reject(err); 
    }
  }
  
  // Still don't know how this will be useful, but that's life
  // o importante é o que importa 
  @ReactMethod
  public void loadAllMusicsInMusicDirectory(Promise promise) {
    
    try {
      // Get all Files in The default Music Directory
      File[] allFiles = defaultDirectory.listFiles();

      List<File> filteredFiles = new ArrayList<File>();

     
      WritableNativeArray RNFileList = new WritableNativeArray();

      // Filter for App Specific Files 
      for (int i = 0; i < allFiles.length; i++) {

        if (allFiles[i].getName().contains("lambda")) {
          filteredFiles.add(allFiles[i]);
        }
      }
      
      // Converting to a format that React Native can handle
      for (int i = 0; i < filteredFiles.toArray().length; i++) {

        String name = filteredFiles.get(i).getName(); 
        String path = filteredFiles.get(i).getPath();
        String absolutePath = filteredFiles.get(i).getAbsolutePath();
        
        WritableNativeMap RNFile = new WritableNativeMap();
        RNFile.putString("filename", name);
        RNFile.putString("path", path);
        RNFile.putString("absolutePath", absolutePath);
        
        RNFileList.pushMap(RNFile);
        
      }
      
      // Send back to JS the results 
      promise.resolve(RNFileList);
      
    } catch (Exception err) {
      promise.reject("Erro ao carregar arquivos", err);
    }
  }
  
  @ReactMethod
  public void getBaseDirectory(Promise promise) {
    try {
      
      promise.resolve(this.defaultDirectory.toString());
      
    } catch (Exception err) {
      promise.reject(err);
    }
  }
  
  // [ ] - Refactor this
  // This uses the default Download Manager
  @ReactMethod
  public void downloadMusicFromURL(String url, String filename, String titleForManager, String descriptionForManager, Promise promise) {

    try {
      Log.d("FileManager", "Iniciando Processo de Downlaod");

      // Gets the Download Manager
      DownloadManager manager = (DownloadManager) getReactApplicationContext().getSystemService(Context.DOWNLOAD_SERVICE);
      Uri uri = Uri.parse(url);

      DownloadManager.Request request = new DownloadManager.Request(uri);

      Log.d("FileManager", "Objetos Criados");

      // config request
      request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE);

      // Create the Formated File ID
      File destinationFile = new File(this.defaultDirectory, filename);

      request.setTitle(titleForManager);
      request.setDescription(descriptionForManager);
      request.setDestinationUri(Uri.fromFile(destinationFile));

      Log.d("FileManager", "URL e Requisição Configurada");

      manager.enqueue(request);
      
      promise.resolve(true);
      
    } catch (Exception err) {
      promise.resolve(false);
    }
    
  }
 
  // does the same thing as the function above but now BETTER
  @ReactMethod
  public void downloadMusicFromURLUsingFetch(String url, String path, Promise promise) {
    FetchConfiguration fetchConfiguration = new FetchConfiguration.Builder(getReactApplicationContext()).setDownloadConcurrentLimit(5).build();

    fetch = Fetch.Impl.getInstance(fetchConfiguration);

    Log.d("FileManager", "Fetch Succesfuly Configured");
    

    Log.d("FileManager", "Added Listeners");
    final Request request = new Request(url , path); 
    
    request.setPriority(Priority.HIGH);
    request.setNetworkType(NetworkType.ALL);
    
    Log.d("FileManager", "Request about to be enqueued");
    
    fetch.enqueue(request, updatedRequest -> {
      
      promise.resolve(true);
    }, error -> {
      promise.reject("An Error ocurred while enqueuing the download request");
    }); 
  }
  

    
}
