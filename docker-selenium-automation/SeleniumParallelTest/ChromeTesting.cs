using System;
using NUnit.Framework;
using OpenQA.Selenium;

namespace SeleniumParallelTest
{
    [TestFixture]
    [Parallelizable]
    public class ChromeTesting : Hooks
    {
        public ChromeTesting() : base(BrowserType.Chrome) { }

        [Test]
        public void ChromeGoogleTest()
        {
            Driver.Navigate().GoToUrl("https://www.google.com");
            Driver.FindElement(By.Name("q")).SendKeys("ExecuteAutomation");
            System.Threading.Thread.Sleep(10000);
            Driver.FindElement(By.Name("btnK")).Click();
            Assert.That(Driver.PageSource.Contains("ExecuteAutomation"),
                Is.EqualTo(true),
                "The text ExecuteAutomation does not exist!");
        }
    }
}
