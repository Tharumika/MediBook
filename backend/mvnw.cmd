@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF)
@REM Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------
@IF "%__MVNW_ARG0_NAME__%"=="" (SET "BASE_DIR=%~dp0")

@SET MAVEN_PROJECTBASEDIR=%BASE_DIR%
@IF NOT "%MAVEN_BASEDIR%"=="" (@SET "MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%")

@SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

@SET DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

@IF EXIST %WRAPPER_JAR% (
    @SET MVNW_VERBOSE=false
) ELSE (
    @ECHO Downloading %DOWNLOAD_URL%
    powershell -Command "&{"^
        "$webclient = new-object System.Net.WebClient;"^
        "if (-not (Test-Path '%MAVEN_PROJECTBASEDIR%\.mvn\wrapper')) { mkdir '%MAVEN_PROJECTBASEDIR%\.mvn\wrapper' }"^
        "$webclient.DownloadFile('%DOWNLOAD_URL%', '%WRAPPER_JAR%')"^
        "}"
)

@SET JAVA_HOME_SETTING=
@FOR /F "usebackq tokens=*" %%a IN (`where java`) DO (
    @SET JAVA_EXE=%%a
    @GOTO :checkJavaVersion
)

:checkJavaVersion
@"%JAVA_EXE%" -version >NUL 2>&1
@IF "%ERRORLEVEL%"=="0" GOTO :run
@ECHO Cannot find a suitable version of Java. Please install Java 17.
@EXIT /B 1

:run
@"%JAVA_EXE%" ^
  -classpath "%WRAPPER_JAR%" ^
  "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" ^
  %WRAPPER_LAUNCHER% %MAVEN_CONFIG% %*
