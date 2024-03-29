﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Security.Cryptography;
using System.Text;
using System.IO;
using System.Xml.Linq;

using Banking.Domain;
using Banking.EFData;
using System.Xml;

namespace Banking.Web.Controllers
{
    [SessionState(System.Web.SessionState.SessionStateBehavior.Disabled)]
    //[RequireHttps]
    public class HomeController : BankingControllerBase
    {
        public ViewResult EnterCode()
        {
            return View("EnterCode");
        }

        public ViewResult TestDb()
        {
            var loh = new Person() { Name = "loh" };
            Storage.Persons.Add(loh);
            Storage.SaveChanges();
            loh = Storage.Persons.SingleOrDefault(p => p.Name == "loh");
            Storage.Persons.Remove(loh);
            Storage.SaveChanges();
            return View("TestDb");
        }

        [HttpPost]
        public ActionResult EnterCode(string code)
        {
            //return Json(new { Success = false });
            if (code == Security.Key)
            {
                var session = new Session()
                {
                    SessionId = Guid.NewGuid(),
                    ExpiresAt = DateTime.Now + Security.SessionTimeout
                };
                Storage.Sessions.Add(session);
                Storage.SaveChanges();
                Response.Cookies.Add(new HttpCookie("account-it.SessionId", session.SessionId.ToString()));
                return new EmptyResult();
            }
            else
                return Error("InvalidCode");
        }
        /*
        [RequireSecurityCode]
        public FileResult GetBackupFile()
        {
            XDocument snapshot = CreateBackupXml();
            MemoryStream stream = new MemoryStream();
            XmlWriter writer = XmlWriter.Create(stream);
            snapshot.Save(stream);
            writer.Close();
            byte[] bytes = stream.ToArray();
            return File(bytes, "text/xml", GetCurrentBackupName());
        }
*/
        public RedirectToRouteResult Redirect()
        {
            return new RedirectToRouteResult("AllOperations", null);
        }

    }
}
