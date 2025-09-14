package main

import (
 "fmt"
 "io/ioutil"
 "net/http"
 "os"
)

func main() {
 http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintln(w, "Hello — Go ConfigMaps & Secrets demo")
 })

 http.HandleFunc("/config", func(w http.ResponseWriter, r *http.Request) {
  cfg := map[string]string{
   "APP_ENV": os.Getenv("APP_ENV"),
   "LOG_LEVEL": os.Getenv("LOG_LEVEL"),
   "DB_HOST": os.Getenv("DB_HOST"),
   // Only show presence of secrets
   "DB_USER_present": fmt.Sprintf("%t", os.Getenv("DB_USER") != ""),
   "DB_PASSWORD_present": fmt.Sprintf("%t", os.Getenv("DB_PASSWORD") != ""),
  }

  // Try reading DB_PASSWORD from mounted secret file
  pw, err := ioutil.ReadFile("/etc/secrets/DB_PASSWORD")
  if err == nil && len(pw) > 0 {
   cfg["DB_PASSWORD_file_present"] = "true"
  } else {
   cfg["DB_PASSWORD_file_present"] = "false"
  }

  for k, v := range cfg {
   fmt.Fprintf(w, "%s=%s\n", k, v)
  }
 })

 port := os.Getenv("PORT")
 if port == "" {
  port = "8080"
 }

 fmt.Printf("Listening on port %s...\n", port)
 http.ListenAndServe(":"+port, nil)
}
