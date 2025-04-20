import { StatusBlock } from "@/components/blocks/status-block";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CardSlider from "./components/card-slider";
import AmountTransfer from "./components/amount-transfer";
import TransactionsTable from "./components/transactions";
import DashboardDropdown from "@/components/dashboard-dropdown";
import HistoryChart from "./components/history-chart";
import AccountChart from "./components/account-chart";
import ColumnRotateLabels from "./components/column-rotate-labels";
import ListaInfluencers from './components/tableInfluencers';



const DashboardKG = () => {
  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="p-6">
          <div className="grid xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 place-content-center">
          <StatusBlock
              title="Total de Recargas (Mês)"
              total="R$ 45.320,00"
              chartType="bar"
              className="bg-default-50 shadow-none border-none"
              opacity={1}
            />

            <StatusBlock
              title="Salário dos funcionários"
              total="R$ 30.320,00"
              chartColor="#FCDADA"
              chartType="bar"
              className="bg-default-50 shadow-none border-none"
              opacity={1}
            />
            <StatusBlock
              title="Salário da Agência"
              total="R$ 12.800,00"
              chartColor="#80fac1"
              className="bg-default-50 shadow-none border-none"
              series={[40, 70, 45, 100, 75, 40, 80, 90]}
              chartType="bar"
              opacity={1}
            />
            <StatusBlock
              title="Reembolsos Pendentes"
              total="R$ 1.970,00"
              chartColor="#ffbf99"
              className="bg-default-50 shadow-none border-none"
              chartType="bar"
              series={[40, 70, 45, 100, 75, 40, 80, 90]}
              opacity={1}
            />
          </div>
        </CardContent>
      </Card>

      <div className="gap-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
  <Card>
    <CardContent className="p-0">
      <ListaInfluencers />
    </CardContent>
  </Card>
  <Card>
    <CardHeader className="flex-row gap-1">
      <CardTitle className="flex-1">Histórico de Movimentações</CardTitle>
      <DashboardDropdown />
    </CardHeader>
    <CardContent>
      <HistoryChart />
    </CardContent>
  </Card>
</div>
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
        <Card>
          <CardHeader className="flex-row gap-1">
            <CardTitle className="flex-1">A Receber</CardTitle>
            <DashboardDropdown />
          </CardHeader>
          <CardContent>
            <AccountChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row gap-1">
            <CardTitle className="flex-1">A Pagar</CardTitle>
            <DashboardDropdown />
          </CardHeader>
          <CardContent>
            <AccountChart
              series={[
                {
                  data: [31, 40, 28, 51, 42, 109, 100],
                },
              ]}
              chartColor="primary"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardKG;
